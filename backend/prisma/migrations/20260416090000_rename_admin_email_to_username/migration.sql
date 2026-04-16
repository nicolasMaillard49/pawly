-- Rename Admin.email to Admin.username
ALTER TABLE "Admin" DROP CONSTRAINT IF EXISTS "Admin_email_key";
ALTER TABLE "Admin" RENAME COLUMN "email" TO "username";
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
