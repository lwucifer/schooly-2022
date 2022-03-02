import { getDesktopViewFromCookie, getDesktopView } from "~/utils/common";

export default function({ req, store, redirect, isMobile, route }) {
  const isHomeRoute = route.path == "/" || route.path == "/mobile";
  // console.log("[mobile-view]", isHomeRoute);

  if (isHomeRoute) {
    const desktopView = store.state.desktopView;
    const desktopViewStatus = process.server
      ? getDesktopViewFromCookie(req)
      : getDesktopView();

    // console.log("[[mobile-view]] desktopView", desktopView, desktopViewStatus);
    if (isMobile) {
      if (desktopViewStatus && JSON.parse(desktopViewStatus) && route.path == "/mobile") {
        // !desktopView && store.commit("setDesktopView", true);
        store.commit("setDesktopView", true);
        redirect("/");
      } else if(route.path == "/" && !desktopViewStatus){
        store.commit("setDesktopView", false);
        redirect("/mobile");
      }
    }
  }
}
