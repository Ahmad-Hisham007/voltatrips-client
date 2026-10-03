"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Mail, Phone, Calendar, Ticket } from "lucide-react";

import {
  BookingFormInput,
  BookingSchema,
  type BookingFormData,
} from "@/lib/validations/booking";

export function BookingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormInput, undefined, BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      phone: "",
      message: "",
      time: "10:00",
      adults: 1,
      children: 0,
      infants: 0,
      date: undefined as unknown as Date,
      tickets: 1,
    },
  });
  const dateValue = watch("date");

  const isDateActive = !!dateValue;

  const onSubmit = (data: BookingFormData) => {
    // Placeholder — Server Action integration
    console.log("Booking submit:", data);
  };

  return (
    <div className="w-full bg-[url('/background-booking-img-1.jpg')] p-6 sm:p-8 flex flex-col items-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-[28px] font-bold text-heading text-center mb-6 font-sans">
        Book this tour
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-3.5"
        aria-label="Book this tour"
      >
        {/* Name Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Pencil className="w-4 h-4 text-primary absolute left-4 shrink-0" />
            <input
              type="text"
              placeholder="Name *"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans"
              {...register("name")}
            />
          </div>
          {errors.name?.message && (
            <p className="text-xs text-error mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Mail className="w-4 h-4 text-primary absolute left-4 shrink-0" />
            <input
              type="email"
              placeholder="Email *"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans"
              {...register("email")}
            />
          </div>
          {errors.email?.message && (
            <p className="text-xs text-error mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Confirm Email Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Mail className="w-4 h-4 text-primary absolute left-4 shrink-0" />
            <input
              type="email"
              placeholder="Confirm Email *"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans"
              {...register("confirmEmail")}
            />
          </div>
          {errors.confirmEmail?.message && (
            <p className="text-xs text-error mt-1">
              {errors.confirmEmail.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Phone className="w-4 h-4 text-primary absolute left-4 shrink-0" />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans"
              {...register("phone")}
            />
          </div>
          {errors.phone?.message && (
            <p className="text-xs text-error mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Date Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Calendar className="w-4 h-4 text-primary absolute left-4 shrink-0 pointer-events-none" />
            <input
              type={isDateActive ? "date" : "text"}
              placeholder="dd-mm-yy *"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans uppercase"
              onFocus={(e) => {
                setValue("date", " ", { shouldValidate: false });
                // Trigger RHF change if needed
              }}
              {...register("date", {
                onBlur: (e) => {
                  if (!e.target.value.trim()) {
                    setValue("date", "");
                  }
                },
              })}
            />
          </div>
          {errors.date?.message && (
            <p className="text-xs text-error mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Number of Tickets Field */}
        <div>
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Ticket className="w-4 h-4 text-primary absolute left-4 shrink-0" />
            <input
              type="number"
              min={1}
              placeholder="Number of tickets *"
              className="w-full py-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans"
              {...register("tickets")}
            />
          </div>
          {errors.tickets?.message && (
            <p className="text-xs text-error mt-1">{errors.tickets.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <div className="relative flex bg-white border border-gray-200 focus-within:border-primary transition-colors">
            <Pencil className="w-4 h-4 text-primary absolute left-4 top-4 shrink-0" />
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full pt-3.5 pb-3.5 pl-11 pr-4 text-body text-sm bg-transparent outline-none placeholder:text-gray-400 font-sans resize-y"
              {...register("message")}
            />
          </div>
          {errors.message?.message && (
            <p className="text-xs text-error mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-white hover:bg-gray-50 text-heading border border-gray-200 font-bold tracking-widest text-sm py-4 px-4 transition-colors cursor-pointer uppercase shadow-2xs disabled:opacity-50"
        >
          {isSubmitting ? "Checking..." : "AVAILABILITY"}
        </button>
      </form>

      {/* Footer Disclaimer */}
      <p className="mt-6 text-sm text-body text-center font-sans font-light">
        Please log in to book a tour
      </p>
    </div>
  );
}

BookingForm.displayName = "BookingForm";
