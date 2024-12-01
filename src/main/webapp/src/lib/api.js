import history from "./history";

export const session = {
  endpoint: "/api/session",
  get: () => get(session.endpoint).then(verify).then(parseJson),
  login: (data) => post(session.endpoint, data).then(verify).then(parseJson),
  logout: () => deleTe(session.endpoint).then(verify),
};

export const activity = {
  endpoint: "/api/activity",
  list: (q, c, d) =>
    get(activity.endpoint, q, c, d)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  get: (id) =>
    get(`${activity.endpoint}/${id}`)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  add: (data) =>
    post(activity.endpoint, data).then(authorize).then(verify).then(parseJson),
  edit: (id, data) =>
    put(`${activity.endpoint}/${id}`, data)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  remove: (id) =>
    deleTe(`${activity.endpoint}/${id}`).then(authorize).then(verify),
};

export const user = {
  endpoint: "/api/user",

  // Fetch all users
  list: (queryParams, config, defaultValue) =>
    get(user.endpoint, queryParams, config, defaultValue)
      .then(authorize)
      .then(verify)
      .then(parseJson),

  // Fetch a user by ID
  get: (id) =>
    get(`${user.endpoint}/${id}`).then(authorize).then(verify).then(parseJson),

  // Add a new user
  add: (data) =>
    post(user.endpoint, data).then(authorize).then(verify).then(parseJson),

  // Update an existing user
  edit: (id, data) => {
    if (!id) throw new Error("User ID is required for editing");
    console.log("aaaaasd");
    // validateUserData(data);
    return put(`${user.endpoint}/${id}`, data)
      .then(authorize)
      .then(verify)
      .then(parseJson);
  },
  // Delete a user
  remove: (id) => deleTe(`${user.endpoint}/${id}`).then(authorize).then(verify),
};

export const activityDay = {
  endpoint: (activityId) => `${activity.endpoint}/${activityId}/day`,
  list: (activityId) =>
    get(activityDay.endpoint(activityId))
      .then(authorize)
      .then(verify)
      .then(parseJson),
  get: (activityId, id) =>
    get(`${activityDay.endpoint(activityId)}/${id}`)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  add: (activityId, data) =>
    post(activityDay.endpoint(activityId), data)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  edit: (activityId, id, data) =>
    put(`${activityDay.endpoint(activityId)}/${id}`, data)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  remove: (activityId, id) =>
    deleTe(`${activityDay.endpoint(activityId)}/${id}`)
      .then(authorize)
      .then(verify),
};

export const file = {
  endpoint: "/api/file",
  get: (id) =>
    get(`${file.endpoint}/${id}`).then(authorize).then(verify).then(parseJson),
  add: (data) =>
    post(file.endpoint, data, true)
      .then(authorize)
      .then(verify)
      .then(parseJson),
};

export const voucher = {
  endpoint: "/api/voucher",
  list: (q, c, d) =>
    get(voucher.endpoint, q, c, d).then(authorize).then(verify).then(parseJson),
  get: (id) =>
    get(`${voucher.endpoint}/${id}`)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  add: (data) =>
    post(voucher.endpoint, data).then(authorize).then(verify).then(parseJson),
  edit: (id, data) =>
    put(`${voucher.endpoint}/${id}`, data)
      .then(authorize)
      .then(verify)
      .then(parseJson),
  remove: (id) =>
    deleTe(`${voucher.endpoint}/${id}`).then(authorize).then(verify),
  reset: (id) =>
    deleTe(`${voucher.endpoint}/${id}/reset`).then(authorize).then(verify),
  unredeem: (id) =>
    deleTe(`${voucher.endpoint}/${id}/unredeem`).then(authorize).then(verify),
};

//
// actions
//

const get = (url, query, orderBy, order) => {
  const params = [];

  if (query) {
    params.push(`q=${query}`);
  }
  if (orderBy) {
    params.push(`orderBy=${orderBy}`);
  }
  if (order) {
    params.push(`order=${order}`);
  }

  if (params.length === 0) {
    return fetch(url);
  } else {
    return fetch(`${url}?${params.join("&")}`);
  }
};

const post = (url, data, raw) => {
  if (raw) {
    return fetch(url, {
      method: "POST",
      body: data,
    });
  }

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const put = (url, data) => {
  return fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const deleTe = (url) => {
  return fetch(url, {
    method: "DELETE",
  });
};

//
// processing
//

const authorize = (response) => {
  if (!response.ok && response.status === 401) {
    history.push("/login");
    // TODO abort
  } else {
    return response;
  }
};

const verify = (response) => {
  if (!response.ok) {
    // TODO display error
    throw Error(response.statusText);
  }
  return response;
};

const parseJson = (response) => {
  if (response.status != 204) {
    return response.json();
  } else {
    return null;
  }
};
