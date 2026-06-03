import styled from '@emotion/styled';
import CheckGray from '../../public/CheckGray.svg';
import CheckWhite from '../../public/CheckWhite.svg';

interface CheckBoxProps {
    checkStatus: boolean;
    handleCheckClick: () => void;
}

// 만들다보니 그냥 배경까지 포함한 이미지를 조건부로 보여주면 될 것 같은데, 직접 구현 방식이 귀찮기도 하고 체크 아이콘과 배경 상태를 따로 동기화해주기 때문에 더 불안정한 느낌
export default function CheckBox({ checkStatus, handleCheckClick }: CheckBoxProps) {
    return (
        <CheckBoxContainer checkStatus={checkStatus} onClick={handleCheckClick}>
            <CheckIcon src={checkStatus ? CheckWhite : CheckGray} />
        </CheckBoxContainer>
    );
}

interface CheckBoxContainerProps {
    checkStatus: boolean;
}

const CheckBoxContainer = styled.button<CheckBoxContainerProps>`
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-color: ${(props) => (props.checkStatus ? '#0000001A' : '#ffffff')};
    border: ${(props) => (props.checkStatus ? 'none' : '1px solid #0000001A')};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CheckIcon = styled.img``;
