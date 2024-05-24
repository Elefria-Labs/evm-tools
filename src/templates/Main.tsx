import { GlobalHeader } from '@components/global-header';
import { PageWrapper } from '@components/page-wrapper';
import { ReactNode } from 'react';
import { Footer } from '@components/Footer';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  return (
    <div>
      {props.meta}
      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <PageWrapper>
          <GlobalHeader />
          <div className="flex flex-col content-between items-center min-h-screen">
            <div className="flex flex-col max-w-[1024px] w-11/12">
              {props.children}
            </div>
          </div>
          <Footer />
        </PageWrapper>
      </div>
    </div>
  );
};
export { Main };
