import {buildLegalPage} from "./legal.js";

export async function onRequestGet({params, env}) {
  return buildLegalPage(params.subdomain, "datenschutz", env);
}
