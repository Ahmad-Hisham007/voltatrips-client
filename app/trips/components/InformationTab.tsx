import { Trip } from "@/lib/queries/trip";
import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { FaRegAddressCard } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";

export default function InformationTab({ trip }: { trip: Trip }) {
  return (
    <div className="flex flex-col">
      {/* Title & Price Header */}
      <div className="mb-5">
        <h2 className="text-heading text-4xl! lg:text-3xl block">
          {trip.title}
        </h2>
        <div className="text-primary italic text-xl leading-tight font-display font-bold mt-2.5">
          ${trip.tripFields.tripPrice} / per person
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: trip.tripFields.tripDetails.tripFullDescription,
        }}
      />
      <div
        className="trip-content hidden"
        dangerouslySetInnerHTML={{
          __html: trip.content || "",
        }}
      />

      {/* Metadata Badges */}
      <div className="flex flex-wrap gap-3 text-sm text-body">
        <span className="flex items-center gap-2">
          <Clock className="w-4" /> {trip.tripFields.tripDuration} Days
        </span>
        <span className="flex items-center gap-2">
          <FaRegAddressCard /> {trip.tripFields.tripAgeRequirement} age
        </span>
        <span className="inline-flex gap-2 items-center rounded-lg bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          <GrMapLocation className="w-4 h-4" />{" "}
          <Link href={"#"}>{trip.tripFields.tripLocation}</Link>
        </span>
      </div>

      {/* Key Details Table */}
      <dl className="divide-y divide-border border-y border-gray-200 mt-5">
        <div className="flex md:flex-row flex-col md:items-center md:justify-start md:py-6 md:p-0 p-8 gap-5">
          <dt className="text-heading font-bold text-[17px] flex-1 md:ml-5">
            Departure
          </dt>
          <dd className="text-left text-body flex-2">
            {trip.tripFields.departure}
          </dd>
        </div>
        <div className="flex md:flex-row flex-col md:items-center md:justify-start md:py-6 md:p-0 p-8 gap-5">
          <dt className="text-heading font-bold text-[17px] flex-1 md:ml-5">
            Departure Time
          </dt>
          <dd className="text-left text-body flex-2">
            {trip.tripFields.departureTime}
          </dd>
        </div>
        <div className="flex md:flex-row flex-col md:items-center md:justify-start md:py-6 md:p-0 p-8 gap-5">
          <dt className="text-heading font-bold text-[17px] flex-1 md:ml-5">
            Dress Code
          </dt>
          <dd className="text-left text-body flex-2">
            {trip.tripFields.dressCode}
          </dd>
        </div>
        <div className="flex md:flex-row flex-col md:items-center md:justify-start md:py-6 md:p-0 p-8 gap-5">
          <dt className="text-heading font-bold text-[17px] flex-1 md:ml-5">
            What&apos;s Included
          </dt>
          <dd className="text-left text-body flex-2">
            <ul className="list-none grid md:grid-cols-2 grid-cols-1 gap-1 text-body">
              {trip.tripFields.tripDetails.whatsIncluded.map((item, i) => (
                <li className="flex items-center gap-2" key={i}>
                  <Check className="text-primary w-4" /> {item.item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="flex md:flex-row flex-col md:items-center md:justify-start md:py-6 md:p-0 p-8 gap-5">
          <dt className="text-heading font-bold text-[17px] flex-1 md:ml-5">
            What&apos;s Not Included
          </dt>
          <dd className="text-left text-body flex-2">
            <ul className="list-none grid md:grid-cols-2 grid-cols-1 gap-1 text-body">
              {trip.tripFields.tripDetails.whatsNotIncluded.map((item, i) => (
                <li className="flex items-center gap-2" key={i}>
                  <IoMdClose className="text-primary w-4" /> {item.item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
}
