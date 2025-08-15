import { Models } from "appwrite";
import React from "react";
import GridPostList from "./GridPostList";
import Loader from "./Loader";
import { searchPosts } from "@/lib/appwrite/api";

type SearchResultsProps = {
    isSEARCHFetching: boolean;
    searchedPosts: Models.Document[];
};

const SearchResults: React.FC<SearchResultsProps> = ({ isSEARCHFetching, searchedPosts }: SearchResultsProps) => {
    if (isSEARCHFetching) 
        return <Loader />
        

    if( searchedPosts && searchedPosts.length > 0){
        return (
            <GridPostList posts = {searchedPosts} />
        )
    }
    return (
        <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    )
}
export default SearchResults;