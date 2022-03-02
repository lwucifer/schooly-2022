
export default function ({ store, route, redirect }) {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    if(!isAuthenticated){
        return redirect(`/auth/signin`);
    }
    
    const isStudentRole = store.getters['auth/isStudentRole'];
    console.log("[Middlware] student role", isStudentRole);
    
    if (!isStudentRole) {
        return redirect(`/`);
    }
}