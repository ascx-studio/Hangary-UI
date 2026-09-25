import { Notionclient } from "./client";

export const getDatabase = async (databaseid: string) => {
  return await Notionclient.databases.retrieve({
    database_id: databaseid,
  });
};

export const getProjectRows = async (dataSourceId?: string) => {
  const sourceId =
    dataSourceId ||
    process.env.NOTION_DATA_SOURCE_ID ||
    "5e127e47-ec88-4826-9f3c-5b28565e3e28";

  const allResults: any[] = [];
  let start_cursor: string | undefined = undefined;

  do {
    const resp: any = await Notionclient.request({
      path: `data_sources/${sourceId}/query`,
      method: "post",
      body: {
        page_size: 100,
        start_cursor,
      },
    });

    allResults.push(...(resp?.results || []));
    start_cursor = resp?.has_more ? resp?.next_cursor : undefined;
  } while (start_cursor);

  return allResults;
};
