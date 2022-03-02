import * as actionTypes from "~/utils/action-types";
import Info from "~/services/elearning/public/Info";
import TeacherEls from "~/services/elearning/public/TeacherEls";
import Related from "~/services/elearning/public/Related";
import ElearningTeacher from "~/services/elearning/public/ElearningTeacher";
import Program from "~/services/elearning/public/Program";

export async function getProgram($axios, options) {
  let res = null;
  try {
    const result = await new Program($axios)[actionTypes.BASE.LIST](options);
    if (result.success) res = result.data;
  } catch (error) {
    console.log(error);
  }
  return res;
}

export async function getTeacher($axios, options) {
  let res = null;
  try {
    const result = await new ElearningTeacher($axios)[actionTypes.BASE.LIST](
      options
    );
    if (result.success) res = result.data;
  } catch (error) {
    console.log(error);
  }
  return res;
}

export async function getInfo($axios, options) {
  let res = null;
  try {
    const result = await new Info($axios)[actionTypes.BASE.LIST](options);
    if (result.success) res = result.data;
  } catch (error) {
    console.log(error);
  }
  return res;
}

export async function getLecturesOfTeacher($axios, options) {
  let res = null;
  try {
    const result = await new TeacherEls($axios)[actionTypes.BASE.LIST](options);
    if (result.success) res = result.data;
  } catch (error) {
    console.log(error);
  }
  return res;
}

export async function getLecturesRelated($axios, options) {
  let res = null;
  try {
    const result = await new Related($axios)[actionTypes.BASE.LIST](options);
    if (result.success) res = result.data;
  } catch (error) {
    console.log(error);
  }
  return res;
}
