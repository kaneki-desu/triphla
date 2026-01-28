// app/components/NewsSection.tsx
import { getNews } from "@/lib/NewsData";
import BidirectionalSlider from "@/components/bidirectionalslider";

export default async function NewsSection() {
  // const news = await getNews();
  const news = '[]';

  return <BidirectionalSlider news={JSON.parse(news) ?? []} />;
}
