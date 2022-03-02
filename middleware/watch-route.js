
import { KEYWORD } from "../utils/mutation-types";
export default function ({ store, route, redirect }) {
    const textSearch = store.state.keyword.keywordSearchHeader;
    // commit mutation to remove keywordSearchHeader all page
    if(route.path){
        store.commit(`keyword/${KEYWORD.CHECK_ROUTE_CLEAR_KEYWORK}`, route.path);
    }
    // commit mutation to remove keywordSearchHeader
    if(textSearch){
        store.commit(`keyword/${KEYWORD.SEARCH_HEADER}`, textSearch);
    }
}