import { Navigate, useNavigate } from "react-router";
import i18n from "src/i18n";

type NavigateWithLocaleProp = {
    to: string
};

function NavigateWithLocale({ to }: NavigateWithLocaleProp){
    console.log("this is called : " + i18n.language);
    return <Navigate to={`/${i18n.language}/${to}`}/>;
}

export function useNavigateWithLocale(path?: string): any{
    const hook = useNavigate();
    
    function navigate(dataId ?: string){
        console.log("navigate called : " + i18n.language)
        hook(`/${i18n.language}/${path}${!!dataId?'/'+dataId:''}`);
    }

    if(!!path){
        return navigate;
    }else{
        console.log(path);
        return (path: string) => (dataId: string) => {
            return hook(`/${i18n.language}/${path}${!!dataId?'/'+dataId:''}`);
        };
    }

}

export default NavigateWithLocale;