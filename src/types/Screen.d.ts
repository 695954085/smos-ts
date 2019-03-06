interface Props {
  navigator: Navigator
}

interface Navigator {
  push(routeName: string): void
  pop(): void
}