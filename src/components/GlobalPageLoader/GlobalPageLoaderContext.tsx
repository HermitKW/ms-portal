import React, { ReactNode, useCallback, useState } from "react";
import PageLoader from "../PageLoader";

type GlobalPageLoaderProvider = {
    // 
    showGlobalPageLoader: boolean,
    setShowGlobalPageLoader: (data: boolean) => void
};


/**
 * store a flag for page loader
 */
export const ShowPageLoaderContext = React.createContext<GlobalPageLoaderProvider["showGlobalPageLoader"]>(false);
/**
 * a setter to set above page loader flag
 */
export const SetPageLoaderContext = React.createContext<GlobalPageLoaderProvider["setShowGlobalPageLoader"]>(null);

/**
 * Check file: MaintainSystemParametersResultTable.tsx to check use case
 * @param 
 * @returns 
 */
export const GlobalPageLoaderProvider = ({ children }: { children: ReactNode }) => {
    const [showGlobalPageLoader, setShowGlobalPageLoader] = useState(false);
    // prevent setter change
    const pageLoaderSetter = useCallback(setShowGlobalPageLoader, []);

    // User will only call setter to switch the flag, and the setter will not cause re-render
    return <SetPageLoaderContext.Provider value={pageLoaderSetter}>
        {/* Only one flag custom for page loder flag so we can only warp <PageLoader /> */}
        <ShowPageLoaderContext.Provider value={showGlobalPageLoader}>
            <PageLoader showLoader={showGlobalPageLoader}/>
        </ShowPageLoaderContext.Provider>
            {children}
            {/* We can also warp *children* as well, if we have multiple customer */}
        {/* <ShowPageLoaderContext.Provider value={showGlobalPageLoader}>
            <PageLoader showLoader={showGlobalPageLoader}/>
            {children}
        </ShowPageLoaderContext.Provider> */}
    </SetPageLoaderContext.Provider>
}