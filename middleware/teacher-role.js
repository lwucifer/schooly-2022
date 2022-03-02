
export default function ({ store, route, redirect }) {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    if(!isAuthenticated){
        return redirect(`/auth/signin`);
    }

    const isTeacherRole = store.getters['auth/isTeacherRole'];
    console.log("[Middlware] teacher role", isTeacherRole);
    
    if (!isTeacherRole) {
        return redirect(`/`);
    }
}