export class NotAuthorisedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotAuthorisedError";
  }
}
const fetcher = async (
  url: string,
  data = undefined,
  method: "POST" | "PUT" | "DELETE" = undefined
) => {
  const res = await fetch(`${window.location.origin}/api${url}`, {
    method: data ? method || "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const jsonData = await res.json();
    // Raise a custom error if the user is not authorised to direct to signin
    if (res.status === 401) {
      throw new NotAuthorisedError(jsonData.error);
    }

    throw new Error(`${res.status} ${jsonData.error}`);
  }

  return res.json();
};

export { fetcher };
