-- Create a new table for Persistent RSVP Submissions
-- This table enforces uniqueness on the guest name (acting as an ID)

CREATE TABLE IF NOT EXISTS public.rsvp_submissions (
    "name" text NOT NULL,
    attendance text,
    guests integer,
    adults integer,
    children integer,
    wishes text,
    gift_item_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT rsvp_submissions_pkey PRIMARY KEY ("name")
);

-- Note: The existing 'rsvp' table is left as-is for historical data or backup, 
-- but the application will switch to using 'rsvp_submissions'.

-- -----------------------------------------------------------------------------
-- SECURITY: Row Level Security (RLS)
-- -----------------------------------------------------------------------------

-- 1. Enable RLS on the table
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for Backend Access
-- Since we connect via the 'postgres' user (or service_role) from the API, 
-- we need a policy to explicitly allow this access while blocking 'anon' or public access.
-- Note: 'postgres' superuser often bypasses RLS, but this safeguards usage of other roles.

CREATE POLICY "Enable full access for backend"
ON public.rsvp_submissions
AS PERMISSIVE
FOR ALL
TO postgres, service_role
USING (true)
WITH CHECK (true);
