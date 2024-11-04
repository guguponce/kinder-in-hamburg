import { NextResponse } from "next/server";
import { getAllFlohmaerteSeparatedByStatus } from "../dbActions";

export async function GET() {
  const flohmaerkte = await getAllFlohmaerteSeparatedByStatus();
  console.log("GET");
  return NextResponse.json(flohmaerkte);
}

export async function POST() {
  const flohmaerkte = await getAllFlohmaerteSeparatedByStatus();
  console.log("POST");
  return NextResponse.json(flohmaerkte);
}
