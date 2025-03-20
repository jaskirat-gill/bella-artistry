'use client';
import { useState } from 'react';

export default function ServiceListPreview({
  services,
}: {
  services: any[]; // Using a generic type for services
}) {
  const smClassName = (services?.length ?? 0) > 1 ? 'sm:grid-cols-2' : '';
  const mdClassName = (services?.length ?? 0) > 2 ? 'md:grid-cols-3' : '';

  return services?.length ? (
    <div
      className={`mx-auto flex flex-wrap my-3 m-auto grid grid-cols-1 gap-4 ${smClassName} ${mdClassName}`}
    >
      {services?.map((service, index) => (
        <ServiceCardPreview service={service} key={index} />
      ))}
    </div>
  ) : null;
}

const ServiceCardPreview = ({ service }: { service: any }) => {
  // Dummy formatted price
  const formattedPrice = "$100.00";

  return (
    <div className="w-full rounded-none overflow-hidden mx-auto border-8 border-pink-900 relative h-full min-h-[300px]">
      <div className="p-6 pb-20 text-center h-full text-pink-900">
        <a
          href={`/service/${service.slug || 'dummy-slug'}`}
          className="font-bold text-xl hover:text-pink-400"
        >
          {service.name || 'Service Name'}
        </a>
        <div className="border-top border border-pink-400 w-full my-6"></div>
        <p className=" text-base">
          {formattedPrice}
        </p>
        <p className=" text-base">
          {service.duration || '1 hour'}
        </p>
      </div>
      <div className="w-full mx-auto pb-8 absolute bottom-0 text-center text-pink-900">
        <a href={`/calendar/${service.slug || 'dummy-slug'}`} className="btn-main">
          Book Now
        </a>
      </div>
    </div>
  );
};
