import { List } from './components/list';
import { getMangaList } from './lib/getMangaList';

export default async function MangaList() {
  const ssrItems = await getMangaList();
  return <List items={ssrItems} />;
}
