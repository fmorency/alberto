import {
  render,
  screen,
  userEvent,
  fireEvent,
  within,
  waitForElementToBeRemoved,
} from "test/test-utils"
import { NetworkMenu } from "../network-menu"

describe("NetworkMenu", () => {
  it("should render with default manifest network", () => {
    render(<NetworkMenu />)
    expect(screen.getAllByText(/manifest/i).length).toBe(2)
  })
  it("should create a new network", async () => {
    const activeNetwork = setupNetworkMenu()
    const addNewBtn = screen.getByText(/add network/i)
    userEvent.click(addNewBtn)

    const modal = screen.getByTestId("network-create-update-contents")
    const saveBtn = within(modal).getByText(/save/i)
    const form = within(modal).getByTestId("create-update-network-form")

    const nameInput = within(form).getByLabelText(/name/i)
    const urlInput = within(form).getByLabelText(/url/i)

    userEvent.type(nameInput, "test-network")
    userEvent.type(urlInput, "test-network/api")
    userEvent.click(saveBtn)

    expect(within(activeNetwork).getByText("test-network")).toBeInTheDocument()
  })
  it("should remove a network", async () => {
    await setupEditNetwork()
    const modal = screen.getByTestId("network-create-update-contents")
    const removeInput = within(modal).getByLabelText(/remove network/i)
    const removeBtn = within(modal).getByTestId("remove network button")
    expect(removeBtn).toBeDisabled()

    userEvent.type(removeInput, "/api")
    expect(removeBtn).not.toBeDisabled()
    userEvent.click(removeBtn)
    expect(screen.queryByText(/manifest/i)).not.toBeInTheDocument()
  })
  it("should edit a network", async () => {
    const activeNetwork = await setupEditNetwork()
    const nameInput = screen.getByLabelText(/name/i)
    const urlInput = screen.getByLabelText(/url/i)
    const saveBtn = screen.getByRole("button", { name: /save/i })
    userEvent.type(nameInput, "-edited")
    userEvent.type(urlInput, "-edited")

    expect(nameInput).toHaveValue("Manifest Ledger-edited")
    expect(urlInput).toHaveValue("/api-edited")
    userEvent.click(saveBtn)
    expect(
      within(activeNetwork).getByText(/manifest ledger-edited/i),
    ).toBeInTheDocument()
  })
})

function setupNetworkMenu() {
  render(<NetworkMenu />)
  const activeNetwork = screen.getByLabelText("active network menu trigger")
  userEvent.click(activeNetwork)
  return activeNetwork
}

async function setupEditNetwork() {
  const activeNetwork = setupNetworkMenu()
  const editBtn = (
    await screen.findAllByRole("button", { name: /edit network/i })
  )[0]
  fireEvent.click(editBtn)
  return activeNetwork
}
