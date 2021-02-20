import Link from 'next/link';
import Head from 'next/head';

const MainContainer = ({children, keywords}) => {
    return (
        <>
            <Head>
                <meta keywords={"nextjs " + keywords}></meta>
                <title>SSR App</title>
            </Head>
                
            {children}
        </>
        
    )
}

export default MainContainer;