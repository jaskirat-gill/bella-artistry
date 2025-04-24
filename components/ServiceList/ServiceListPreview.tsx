'use client';

import { formatDuration } from "@/lib/utils";
import Service from "@/lib/types";

export default function ServiceListPreview({
  services,
}: {
  services: Service[];
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

const ServiceCardPreview = ({ service }: { service: Service }) => {

  return (
    <div className="w-full rounded-none overflow-hidden mx-auto border-8 border-pink-900 relative h-full min-h-[300px]">
      <div className="p-6 pb-20 text-center h-full text-pink-900">
        <a
          href={`/book-now/${service.slug}`}
          className="font-bold text-xl hover:text-pink-400"
        >
          {service.title}
        </a>
        <div className="border-top border border-pink-400 w-full my-6"></div>
        <p className=" text-base">
          {formatDuration(service.duration)}
        </p>
      </div>
      <div className="w-full mx-auto pb-8 absolute bottom-0 text-center text-pink-900">
        <a href={`/book-now`} className="btn-main">
          Book Now
        </a>
      </div>
    </div>
  );
};
