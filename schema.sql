-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.platform_admins (
  user_id uuid NOT NULL,
  CONSTRAINT platform_admins_pkey PRIMARY KEY (user_id),
  CONSTRAINT platform_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'::text),
  org_name text NOT NULL,
  owner_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free'::text CHECK (plan = ANY (ARRAY['free'::text, 'pro'::text, 'enterprise'::text])),
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'suspended'::text])),
  version integer NOT NULL DEFAULT 0,
  visits integer NOT NULL DEFAULT 0,
  published jsonb,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT organizations_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.org_members (
  org_id uuid NOT NULL,
  user_id uuid NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'owner'::text CHECK (role = ANY (ARRAY['owner'::text, 'organizer'::text, 'judge'::text, 'volunteer'::text])),
  CONSTRAINT org_members_pkey PRIMARY KEY (org_id, user_id),
  CONSTRAINT org_members_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id),
  CONSTRAINT org_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.org_drafts (
  org_id uuid NOT NULL,
  draft jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT org_drafts_pkey PRIMARY KEY (org_id),
  CONSTRAINT org_drafts_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  event_id text NOT NULL,
  event_title text NOT NULL,
  team_name text NOT NULL,
  members jsonb NOT NULL,
  payment_method text NOT NULL DEFAULT ''::text,
  sender_number text NOT NULL DEFAULT ''::text,
  txn_id text NOT NULL DEFAULT ''::text,
  amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT registrations_pkey PRIMARY KEY (id),
  CONSTRAINT registrations_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.registration_emails (
  registration_id uuid NOT NULL,
  org_id uuid NOT NULL,
  event_id text NOT NULL,
  email text NOT NULL,
  CONSTRAINT registration_emails_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.registrations(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  at timestamp with time zone NOT NULL DEFAULT now(),
  actor text NOT NULL,
  org_id uuid,
  org_name text,
  action text NOT NULL,
  detail text NOT NULL DEFAULT ''::text,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id)
);