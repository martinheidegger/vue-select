import { selectWithProps } from "../helpers";
import OpenIndicator from "../../src/components/OpenIndicator";

const preventDefault = jest.fn()

function clickEvent (currentTarget) {
  return { currentTarget, preventDefault }
}

describe("Toggling Dropdown", () => {
  it("should not open the dropdown when the el is clicked but the component is disabled", () => {
    const Select = selectWithProps({ disabled: true });
    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search));
    expect(Select.vm.open).toEqual(false);
  });

  it("should open the dropdown when the el is clicked", () => {
    const Select = selectWithProps({
      value: [{ label: "one" }],
      options: [{ label: "one" }]
    });

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search));
    expect(Select.vm.open).toEqual(true);
  });

  it("should not close the dropdown when the el is clicked and enableMouseInputSearch is set to true", () => {
    const Select = selectWithProps({
      value: [{ label: "one" }],
      options: [{ label: "one" }],
      enableMouseSearchInput: true
    });

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search));
    expect(Select.vm.open).toEqual(true);
    Select.vm.toggleDropdown(clickEvent(Select.vm.$el));
    expect(Select.vm.open).toEqual(false)
  });

  it("should open the dropdown when the selected tag is clicked", () => {
    const Select = selectWithProps({
      value: [{ label: "one" }],
      options: [{ label: "one" }]
    });

    const selectedTag = Select.find(".vs__selected").element;

    Select.vm.toggleDropdown(clickEvent(selectedTag));
    expect(Select.vm.open).toEqual(true);
  });

  it("can close the dropdown when the el is clicked", () => {
    const Select = selectWithProps();
    const spy = jest.spyOn(Select.vm.$refs.search, "blur");

    Select.vm.open = true;
    Select.vm.toggleDropdown(clickEvent(Select.vm.$el));

    expect(spy).toHaveBeenCalled();
  });

  it("closes the dropdown when an option is selected, multiple is true, and closeOnSelect option is true", () => {
    const Select = selectWithProps({
      value: [],
      options: ["one", "two", "three"],
      multiple: true
    });

    Select.vm.open = true;
    Select.vm.select("one");

    expect(Select.vm.open).toEqual(false);
  });

  it("does not close the dropdown when the el is clicked, multiple is true, and closeOnSelect option is false", () => {
    const Select = selectWithProps({
      value: [],
      options: ["one", "two", "three"],
      multiple: true,
      closeOnSelect: false
    });

    Select.vm.open = true;
    Select.vm.select("one");

    expect(Select.vm.open).toEqual(true);
  });

  it("should close the dropdown on search blur", () => {
    const Select = selectWithProps({
      options: [{ label: "one" }]
    });

    Select.vm.open = true;
    Select.find({ ref: "search" }).trigger("blur");

    expect(Select.vm.open).toEqual(false);
  });

  it("will close the dropdown and emit the search:blur event from onSearchBlur", () => {
    const Select = selectWithProps();
    const spy = jest.spyOn(Select.vm, "$emit");

    Select.vm.open = true;
    Select.vm.onSearchBlur();

    expect(Select.vm.open).toEqual(false);
    expect(spy).toHaveBeenCalledWith("search:blur");
  });

  it("will open the dropdown and emit the search:focus event from onSearchFocus", () => {
    const Select = selectWithProps();
    const spy = jest.spyOn(Select.vm, "$emit");

    Select.vm.onSearchFocus();

    expect(Select.vm.open).toEqual(true);
    expect(spy).toHaveBeenCalledWith("search:focus");
  });

  it("will close the dropdown on escape, if search is empty", () => {
    const Select = selectWithProps();
    const spy = jest.spyOn(Select.vm.$refs.search, "blur");

    Select.vm.open = true;
    Select.vm.onEscape();

    expect(spy).toHaveBeenCalled();
  });

  it("should remove existing search text on escape keydown", () => {
    const Select = selectWithProps({
      value: [{ label: "one" }],
      options: [{ label: "one" }]
    });

    Select.vm.search = "foo";
    Select.find('.vs__search').trigger('keydown.esc')
    expect(Select.vm.search).toEqual("");
  });

  it("should have an open class when dropdown is active", () => {
    const Select = selectWithProps();

    expect(Select.vm.stateClasses['vs--open']).toEqual(false);

    Select.vm.open = true;
    expect(Select.vm.stateClasses['vs--open']).toEqual(true);
  });

  it("should not display the dropdown if noDrop is true", async () => {
    const Select = selectWithProps({
      noDrop: true,
    });

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search));

    expect(Select.vm.open).toEqual(true);
    await Select.vm.$nextTick();

    expect(Select.contains('.vs__dropdown-menu')).toBeFalsy();
    expect(Select.contains('.vs__dropdown-option')).toBeFalsy();
    expect(Select.contains('.vs__no-options')).toBeFalsy();
    expect(Select.vm.stateClasses['vs--open']).toBeFalsy();
  });

  it("should hide the open indicator if noDrop is true", () => {
    const Select = selectWithProps({
      noDrop: true,
    });
    expect(Select.contains(OpenIndicator)).toBeFalsy();
  });

  it("should not add the searchable state class when noDrop is true", () => {
    const Select = selectWithProps({
      noDrop: true,
    });
    expect(Select.classes('vs--searchable')).toBeFalsy();
  });

  it("should not add the searching state class when noDrop is true", () => {
    const Select = selectWithProps({
      noDrop: true,
    });

    Select.vm.search = 'Canada';

    expect(Select.classes('vs--searching')).toBeFalsy();
  });

  it("can be opened with dropdownShouldOpen", () => {
    const Select = selectWithProps({
      noDrop: true,
      dropdownShouldOpen: () => true,
      options: ['one']
    });

    expect(Select.classes('vs--open')).toBeTruthy();
    expect(Select.find('.vs__dropdown-menu li')).toBeTruthy();
  })
});
