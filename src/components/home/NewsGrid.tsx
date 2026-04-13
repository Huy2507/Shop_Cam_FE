import type { NewsItem } from "../../types/home";
import type { NewsPageLayout, NewsVisualTemplate } from "../../types/siteUi";
import { getNewsVisualSkin, normalizeNewsVisualTemplate } from "./newsVisualSkins";
import { resolveMediaUrl } from "@utils/mediaUrl";
import { Link } from "react-router-dom";

const gridColsClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export interface NewsGridProps {
  news: NewsItem[];
  layout: NewsPageLayout;
  showFeatured: boolean;
  gridColumns: 2 | 3 | 4;
  visualTemplate?: NewsVisualTemplate;
  /** Tiêu đề block (từ cấu hình site hoặc mặc định). */
  sectionTitle?: string;
}

const NewsGrid = ({
  news,
  layout,
  showFeatured,
  gridColumns,
  visualTemplate: visualTemplateProp,
  sectionTitle = "Tin tức",
}: NewsGridProps) => {
  const visual = normalizeNewsVisualTemplate(visualTemplateProp);
  const s = getNewsVisualSkin(visual);
  const cols = gridColsClass[gridColumns];

  if (!news.length) {
    return (
      <section className={s.section}>
        <h2 className={s.title}>{sectionTitle}</h2>
        <p className={s.emptyText}>Chưa có tin tức.</p>
      </section>
    );
  }

  if (layout === "list") {
    return (
      <section className={s.section}>
        <h2 className={s.title}>{sectionTitle}</h2>
        <ul className={s.listUl}>
          {news.map((item) => (
            <li key={item.id}>
              <Link to={`/tin-tuc/${item.id}`} className={s.listItemLink}>
                <div className={s.listThumb}>
                  <img src={resolveMediaUrl(item.imageUrl)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 py-1">
                  <h3 className={s.listTitle}>{item.title}</h3>
                  {item.excerpt ? <p className={s.listExcerpt}>{item.excerpt}</p> : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const useMagazine = layout === "magazine" && showFeatured;
  if (!useMagazine) {
    return (
      <section className={s.section}>
        <h2 className={s.title}>{sectionTitle}</h2>
        <div className={`grid ${s.gridGap} ${cols}`}>
          {news.map((item) => (
            <Link key={item.id} to={`/tin-tuc/${item.id}`} className={s.cardSmWrapper}>
              <div className={s.cardSmInner}>
                <img src={resolveMediaUrl(item.imageUrl)} alt={item.title} className={s.cardSmImg} />
                <div className={s.cardSmOverlay} />
                <h3 className={s.cardSmTitle}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const [featured, ...rest] = news;

  return (
    <section className={s.section}>
      <h2 className={s.title}>{sectionTitle}</h2>

      <div className={`grid ${s.gridGap} ${cols}`}>
        {featured && (
          <div className={s.featureCol}>
            <Link to={`/tin-tuc/${featured.id}`} className={`${s.featureInner} group`}>
              <div className={s.featureImg}>
                <img
                  src={resolveMediaUrl(featured.imageUrl)}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className={s.featureOverlay} />
                <h3 className={s.featureTitle}>{featured.title}</h3>
              </div>
            </Link>
          </div>
        )}

        {rest.slice(0, 6).map((item) => (
          <Link key={item.id} to={`/tin-tuc/${item.id}`} className={s.cardSmWrapper}>
            <div className={s.cardSmInner}>
              <img src={resolveMediaUrl(item.imageUrl)} alt={item.title} className={s.cardSmImg} />
              <div className={s.cardSmOverlay} />
              <h3 className={s.cardSmTitle}>{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
