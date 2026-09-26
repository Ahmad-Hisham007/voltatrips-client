"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BookingSchema, type BookingFormData } from "@/lib/validations/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { Counter } from "@/components/ui/counter";

/**
 * Sidebar booking form.
 * Reuses the shared BookingSchema so server & client rules match.
 * On submit it calls a Server Action (to be created in the auth/checkout
 * phase) which re-validates with the same schema.
 */
export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      adults: 2,
      children: 0,
      infants: 0,
      time: "10:00",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    // Placeholder — wire to Server Action in a later phase.
    console.log("Booking submit:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Book this trip"
    >
      <DatePicker
        label="Departure date"
        value={date ? date.toISOString().split("T")[0] : ""}
        onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
        error={errors.date?.message}
      />

      <Select
        label="Departure time"
        error={errors.time?.message}
        defaultValue="10:00"
        {...register("time")}
      />

      <div className="space-y-2">
        <Counter
          label="Adults"
          value={adults}
          min={1}
          max={20}
          onChange={(v) => {
            setAdults(v);
          }}
        />
        <Counter
          label="Children"
          value={children}
          min={0}
          max={20}
          onChange={setChildren}
        />
        <Counter
          label="Infants"
          value={infants}
          min={0}
          max={20}
          onChange={setInfants}
        />

        {/* keep form state in sync with Counter for validation */}
        <input type="hidden" {...register("adults")} value={adults} />
        <input type="hidden" {...register("children")} value={children} />
        <input type="hidden" {...register("infants")} value={infants} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="First name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          placeholder="Last name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="tel"
          placeholder="Phone"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <input type="hidden" {...register("date")} />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Booking…" : "Book Now"}
      </Button>
    </form>
  );
}

BookingForm.displayName = "BookingForm";
