-- ============================================================
-- Admin Roles & Audit Logs Migration
-- Adds role/status/credits to profiles, creates admin_audit_logs
-- ============================================================

-- 1. Add role & status columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'dev', 'owner'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'suspended', 'banned'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_reason text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_changed_by uuid REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_changed_at timestamptz;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_assigned_by uuid REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_assigned_at timestamptz;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits integer NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_ip text;

-- 2. RLS: Allow admin+ to read all profiles
CREATE POLICY "admin_view_all_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'dev', 'owner')
    )
  );

-- 3. Admin audit logs table (append-only)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  target_user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text NOT NULL DEFAULT '0.0.0.0',
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin+ can read logs
CREATE POLICY "admin_read_logs" ON admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'dev', 'owner')
    )
  );

-- Admin+ can insert logs
CREATE POLICY "admin_insert_logs" ON admin_audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'dev', 'owner')
    )
  );

-- Logs are immutable: no UPDATE or DELETE
CREATE POLICY "logs_no_update" ON admin_audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "logs_no_delete" ON admin_audit_logs
  FOR DELETE USING (false);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_target_user ON admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
