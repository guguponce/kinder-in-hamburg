import { NextResponse } from "next/server";
import { getAllFlohmaerteSeparatedByStatus } from "../dbActions";

export async function GET() {
  const flohmaerkte = await getAllFlohmaerteSeparatedByStatus();

  return NextResponse.json(flohmaerkte);
}
