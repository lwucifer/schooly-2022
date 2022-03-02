/**
 * to prevent loggedInUser from accessing to signin/signup page
 * @param {*} param0 
 */
export default function ({
  store,
  route,
  redirect
}) {
  console.log('auth')
  if (store.getters['auth/isAuthenticated']) {
    if (route.path.includes('/auth/signin') || route.path.includes('/auth/signup')) {
      return redirect(`/`)
    }
  }
}
