import { observable, action } from 'mobx';

class UIStore {
  @observable visibleAddFriendsDialog: Boolean = false;

  @observable visibleRemoveFriendDialog: Boolean = false;

  @observable addFriendByPhoneNumberButtonDisabled: Boolean = true;

  @observable addFriendsDialogInfo: Object = {
    width: 800,
    height: 600,
  };

  @action
  showAddFriendsDialog() {
    this.visibleAddFriendsDialog = true;
  }

  @action
  hideAddFriendsDialog() {
    this.visibleAddFriendsDialog = false;
  }

  @action
  setAddFriendByPhoneNumberButtonDisabled(data: Boolean) {
    this.addFriendByPhoneNumberButtonDisabled = data;
  }
}

export default UIStore;
