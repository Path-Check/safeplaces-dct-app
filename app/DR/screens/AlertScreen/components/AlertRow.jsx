import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { IconButton, Colors } from 'react-native-paper';
import moreIcon from '../../../assets/images/more-vert.png';

// eslint-disable-next-line
export default function AlertRow({ item, showMenuPerItem }) {
  // eslint-disable-next-line
  const { avatarUrl, title, subtitle, text } = item;
  let menu = null;
  const setMenuRef = (ref) => {
    menu = ref;
  };
  const hideMenu = () => menu.hide();
  const showMenu = () => menu.show();

  return (
    <View style={styles.row}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={avatarUrl} />
      </View>
      <View style={styles.captionContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.text}>
          {text}
        </Text>
      </View>

      {showMenuPerItem ? (
        <View style={styles.menuContainer}>
          <Menu
            ref={setMenuRef}
            style={styles.rowMenu}
            button={
              <IconButton
                icon={moreIcon}
                color={Colors.black}
                style={styles.rowMenuButton}
                size={20}
                onPress={showMenu}
              />
            }
          >
            <MenuItem onPress={hideMenu}>Menu item 1</MenuItem>
            <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
            <MenuItem onPress={hideMenu} disabled>
              Menu item 3
            </MenuItem>
            <MenuDivider />
            <MenuItem onPress={hideMenu}>Menu item 4</MenuItem>
          </Menu>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // row
  row: {
    position: 'relative',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 20,
  },
  rowMenu: {
    flexGrow: 1,
  },
  // containers
  imageContainer: {
    flexGrow: 0.25,
    padding: 0,
    width: '20%',
  },
  captionContainer: {
    flexGrow: 1,
    maxWidth: '74%',
    transform: [
      {
        translateX: 20,
      },
    ],
  },
  menuContainer: {
    flexGrow: 0,
    width: 40,
    height: 50,
    transform: [
      {
        translateX: -15,
      },
      {
        translateY: -10,
      },
    ],
  },
  // elements
  image: {
    width: 'auto',
    height: 70,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '100',
    color: '#a6a5a4',
  },
  text: {
    paddingTop: 10,
  },
  rowMenuButton: {},
});
