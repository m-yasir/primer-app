import React from "react";
import { useNavigation } from "react-navigation-hooks";
import { Button, Icon } from "react-native-ui-kitten";


const HeaderBackButton = (props) => {
    const navigation = useNavigation();

    const popBack = () => {
        navigation.goBack();
    };

    return (
        <Button onClick={popBack}>
            <Icon name="arrow-back-outline" />
        </Button>
    );
};

export default HeaderBackButton;