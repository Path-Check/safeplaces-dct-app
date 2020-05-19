export default function(dataList) {
  const data = dataList.news.map(item => ({
    ...item,
    img: { source: { uri: Object.values(item.img)[1] } },
  }));

  return data;
}
