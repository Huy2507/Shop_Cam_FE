import type { NewsItem } from "../../types/home";

interface NewsGridProps {
  news: NewsItem[];
}

const NewsGrid = ({ news }: NewsGridProps) => {
  const [featured, ...rest] = news;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-6 text-center text-xl font-bold text-slate-800">Tin tức</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Featured (larger) */}
        {featured && (
          <div className="sm:col-span-2 lg:row-span-2">
            <a
              href="#"
              className="group block overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-200">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="line-clamp-2 text-lg font-semibold text-white">
                    {featured.title}
                  </h3>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Smaller cards */}
        {rest.slice(0, 6).map((item) => (
          <a
            key={item.id}
            href="#"
            className="group block overflow-hidden rounded-lg"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="line-clamp-2 text-sm font-medium text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
