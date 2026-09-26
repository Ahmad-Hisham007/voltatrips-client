import { z } from "zod";

/**
 * Shared booking form schema.
 * Used BOTH:
 *   - in the sidebar booking form (client, React Hook Form)
 *   - in the future checkout Server Action (server re-validation)
 * Keeping it in one place guarantees the same rules run everywhere.
 */
export const BookingSchema = z.object({
  date: z
    .date({ error: (i) => (i.code === "invalid_type" ? "Please choose a date." : i.message) }),
  time: z.string().min(1, "Please choose a departure time."),
  adults: z
    .number()
    .min(1, "At least 1 adult is required.")
    .max(20, "Maximum 20 guests."),
  children: z.number().min(0).max(20, "Maximum 20 children."),
  infants: z.number().min(0).max(20, "Maximum 20 infants."),

  // Passenger contact details — required for checkout, optional in the
  // sidebar teaser form (we keep them in scope so the same schema drives
  // both steps).
  firstName: z.string().min(1, "First name required."),
  lastName: z.string().min(1, "Last name required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(1, "Phone number required."),
});

export type BookingFormData = z.infer<typeof BookingSchema>;
