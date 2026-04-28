import {buildLegalPage} from "./legal.js";

export async function onRequestGet({params, env, request}) {
  return buildLegalPage(params.subdomain, "impressum", env, request);
}
