# Enable required APIs
resource "google_project_service" "firebase" {
  project = var.project_id
  service = "firebase.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "identity_toolkit" {
  project = var.project_id
  service = "identitytoolkit.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "secret_manager" {
  project = var.project_id
  service = "secretmanager.googleapis.com"

  disable_on_destroy = false
}

# Note: Firebase project and Identity Platform configuration should be done manually
# via Firebase Console (https://console.firebase.google.com/)
# 1. Add Firebase to your project
# 2. Enable Google Sign-in in Authentication > Sign-in method
# 3. Configure OAuth client ID and secret

# Note: Using Application Default Credentials (ADC) instead of service account keys
# The Cloud Run service account will be granted Firebase Admin role to use Firebase Admin SDK

# Grant Firebase Admin role to Cloud Run service account
resource "google_project_iam_member" "cloud_run_firebase_admin" {
  project = var.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}
