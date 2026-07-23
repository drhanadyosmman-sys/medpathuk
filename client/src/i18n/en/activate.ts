export const activate = {
  brandBy: "by Health Care Quality School",

  toast: {
    success: "Access activated! Your plan: {tier}",
    invalid: "Invalid code or email. Please check and try again.",
    missing: "Please enter both your access code and email address.",
  },

  already: {
    title: "Already Activated",
    body: "Your account is active. Head to your dashboard to continue.",
    cta: "Go to Dashboard",
  },

  signIn: {
    title: "Sign In First",
    body: "You need to sign in before activating your access code. Your code is linked to a specific email address.",
    cta: "Sign In to Continue",
  },

  success: {
    title: "Access Activated!",
    body: "Redirecting you to onboarding...",
  },

  form: {
    title: "Activate Your Access",
    subtitle: "Enter your invitation code and email",
    codeLabel: "Access Code",
    emailLabel: "Authorised Email Address",
    emailHint: "Must match the email your access code was issued to.",
    verifying: "Verifying...",
    submit: "Activate Access",
    note: "Each access code is valid for one user only and is linked to a single email address. Contact your programme coordinator if you need a code.",
  },
} as const;
