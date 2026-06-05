import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    bottomButtonLabel: string;
    onBottomButtonClick: () => void;
    isBottomButtonDisabled?: boolean;
}

export default function PageLayout({
    children,
    bottomButtonLabel,
    onBottomButtonClick,
    isBottomButtonDisabled = false,
}: PageLayoutProps) {
    return (
        <Wrapper>
            <Header>
                <HeaderTitle>SHOP</HeaderTitle>
            </Header>
            <Main>{children}</Main>
            <BottomButton onClick={onBottomButtonClick} disabled={isBottomButtonDisabled}>
                {bottomButtonLabel}
            </BottomButton>
        </Wrapper>
    );
}

const PAGE_WIDTH = 430;

const Wrapper = styled.div`
    width: ${PAGE_WIDTH}px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    flex-shrink: 0;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
    background-color: black;
`;

const HeaderTitle = styled.h1`
    font-weight: 800;
    font-size: 20px;
    line-height: 16px;
    color: white;
    margin: 0;
`;

const Main = styled.main`
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;
`;

const BottomButton = styled.button`
    flex-shrink: 0;
    width: 100%;
    height: 56px;
    background-color: #000000;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    border: none;
    cursor: pointer;

    &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
    }
`;
