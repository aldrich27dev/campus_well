-- Run once in Supabase Dashboard > SQL Editor after schema.sql.
-- It stores the student identity on alerts and permits students to create only
-- counselor/admin audience alerts through this tightly scoped function.
alter table public.notifications
  add column if not exists actor_name text,
  add column if not exists actor_year_level text,
  add column if not exists event_type text;

create or replace function public.create_staff_notification(
  p_title text,
  p_message text,
  p_audience public.app_role[],
  p_category text default 'system',
  p_risk text default null,
  p_actor_name text default null,
  p_actor_year_level text default null,
  p_event_type text default 'system'
) returns public.notifications
language plpgsql security definer set search_path = public as $$
declare created_notification public.notifications;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if cardinality(p_audience) = 0
    or not (p_audience <@ array['counselor', 'admin']::public.app_role[]) then
    raise exception 'Staff notifications may only target counselor or admin roles';
  end if;

  insert into public.notifications (
    recipient_id, audience_roles, title, message, category, risk,
    actor_name, actor_year_level, event_type
  ) values (
    null, p_audience, p_title, p_message, coalesce(p_category, 'system'), p_risk,
    p_actor_name, p_actor_year_level, coalesce(p_event_type, 'system')
  ) returning * into created_notification;

  return created_notification;
end;
$$;

revoke all on function public.create_staff_notification(text, text, public.app_role[], text, text, text, text, text) from public;
grant execute on function public.create_staff_notification(text, text, public.app_role[], text, text, text, text, text) to authenticated;
