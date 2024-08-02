import { GlobalHeader } from '@components/global-header';
import { PageWrapper } from '@components/page-wrapper';
import { ReactNode } from 'react';
import { Footer } from '@components/Footer';
import ToolCarousel from '@components/common/ToolCarousel';
import { playgroundToolKeyRecord, playgroundToolsList } from '@data/playground';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
  showConnectWallet?: boolean;
  link?: string;
};

const Main = (props: IMainProps) => {
  return (
    <div>
      {props.meta}
      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <PageWrapper>
          <GlobalHeader showConnectWallet={props?.showConnectWallet} />
          {/* <NavBar /> */}
          <div className="flex flex-col content-between items-center min-h-screen">
            <div className="flex flex-col max-w-[1024px] w-11/12">
              {props.children}
            </div>
          </div>
          <div className="flex flex-col content-between items-center ">
            <div className="flex flex-col content-between max-w-[1024px] w-11/12">
              {props?.link != null && (
                <ToolCarousel
                  playgroundTools={playgroundToolsList.filter(
                    (tool) =>
                      tool.category ==
                        // @ts-ignore
                        playgroundToolKeyRecord[props.link!].category &&
                      tool.link != props.link,
                  )}
                />
              )}
            </div>
          </div>
          <Footer />
        </PageWrapper>
      </div>
    </div>
  );
};
export { Main };
