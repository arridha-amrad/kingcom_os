import Stars from "./Stars";

type Props = {
  value: number;
};

export default function Rating({ value }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Stars rating={value} />
      <p>
        {value}
        <span className="text-foreground/50">&nbsp;/&nbsp;5</span>
      </p>
    </div>
  );
}
