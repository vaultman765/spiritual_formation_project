export type Tag = {
  id: number;
  name: string;
  category: string;
};

export type ArcTag = {
  arc_id: string;
  arc_title: string;
  arc_number: number;
  tags: Tag[];
};