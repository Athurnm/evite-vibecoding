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
