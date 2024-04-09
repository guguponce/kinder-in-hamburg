import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import FlohmarktPoster from "@app/components/@PostForm/FlohmarktPoster";
import React from "react";

export default async function FlohmarktPage() {
  const flohmaerkte = await getApprovedFlohmaerkte();
  if (!flohmaerkte)
    return <div>There was a problem retrieving flea markets</div>;
  if (flohmaerkte.length === 0)
    return <div>There are no flea markets to display</div>;
  return (
    <div>
      {flohmaerkte.map((flo) => (
        <React.Fragment key={flo.id}>
          <FlohmarktPoster flohmarkt={flo} />
        </React.Fragment>
      ))}
    </div>
  );
}
