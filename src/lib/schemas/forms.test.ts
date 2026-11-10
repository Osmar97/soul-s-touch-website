import { describe, expect, it } from "vitest";
import { discoverySchema, fieldErrors, loyaltyLookupSchema, reviewSchema } from "./forms";

const review = { name: "Ana", rating: 5, body: "Wonderful, calm massage.", email: "" };

describe("review form", () => {
  it("accepts a complete review without email", () => {
    expect(fieldErrors(reviewSchema, review)).toEqual({});
  });
  it("requires a rating between 1 and 5", () => {
    expect(fieldErrors(reviewSchema, { ...review, rating: 0 }).rating).toBe("errRating");
  });
  it("requires at least 10 characters of text", () => {
    expect(fieldErrors(reviewSchema, { ...review, body: "nice" }).body).toBe("errBody");
  });
  it("rejects a malformed optional email", () => {
    expect(fieldErrors(reviewSchema, { ...review, email: "ana@" }).email).toBe("errEmail");
  });
});

describe("discovery form", () => {
  const base = { source: "google", name: "", contact: "+47 912 34 567", referrer: "" };
  it("accepts a phone number as contact", () => {
    expect(fieldErrors(discoverySchema, base)).toEqual({});
  });
  it("requires who referred when source is a friend", () => {
    expect(fieldErrors(discoverySchema, { ...base, source: "friend" }).referrer).toBe("errReferrer");
  });
  it("rejects contact that is neither email nor phone", () => {
    expect(fieldErrors(discoverySchema, { ...base, contact: "hello" }).contact).toBe("errContact");
  });
});

describe("loyalty lookup", () => {
  it("rejects an empty identifier", () => {
    expect(fieldErrors(loyaltyLookupSchema, { identifier: " " }).identifier).toBe("errIdentifier");
  });
});
