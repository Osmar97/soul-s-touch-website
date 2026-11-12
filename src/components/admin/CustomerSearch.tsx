type Props = {
  search: string;
  onSearch: (value: string) => void;
  rewardsOnly: boolean;
  onRewardsOnly: (value: boolean) => void;
  count: number;
  completed: number;
};

export function CustomerSearch({ search, onSearch, rewardsOnly, onRewardsOnly, count, completed }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-end gap-6">
      <div>
        <label htmlFor="customer-search" className="label-luxe text-muted-foreground">
          Search
        </label>
        <input
          id="customer-search"
          type="search"
          className="mt-3 w-full min-w-64 rounded-none border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold sm:w-72"
          placeholder="Name, email, phone or source"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 accent-[var(--gold)]"
          checked={rewardsOnly}
          onChange={(event) => onRewardsOnly(event.target.checked)}
        />
        Rewards ready to redeem
      </label>
      <p className="text-sm text-muted-foreground">
        {count} customers · {completed} completed sessions recorded
      </p>
    </div>
  );
}
