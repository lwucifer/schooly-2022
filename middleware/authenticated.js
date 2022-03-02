export default function({ store, route, redirect }) {
    // console.log("[mdw] authenticated", store.getters["auth/isAuthenticated"], route.path)
    if (!store.getters["auth/isAuthenticated"]) {
        if (route.path.includes("/auth/signin") || route.path.includes("/mobile")) {} else {
            console.log("[auth] /login");
            return redirect(`/auth/signin`);
        }
    }
}