setwd('C:/Users/dahenn07/Dropbox/datablog/turnout')

require(dplyr)
require(tidyr)

historical <- read.csv('data/turnout.csv')
historical$TurnoutHO <- as.numeric(lapply(historical$TurnoutHO, function(x) {as.numeric(gsub("%", "", as.character(x)))/100}))
updated <- read.csv('data/updated.csv')
ev2016 <- historical %>% filter(Year==2016) %>% select(State_ab = Abbreviation, VEP_16 = VEP)
ev2012 <- historical %>% filter(Year==2012) %>% select(State_ab = Abbreviation, VEP_12 = VEP)
updated <- merge(updated, ev2012, by = 'State_ab', all.x = TRUE)
updated <- merge(updated, ev2016, by = 'State_ab', all.x = TRUE)
# updated[c('votes_12_total','votes_16_total','VEP_16','VEP_12')] <- lapply(updated[c('votes_12_total','votes_16_total','VEP_16','VEP_12')], function(x) {as.numeric(gsub(",", "", as.character(x)))})
updated$turnout_12 = with(updated, votes_12_total/VEP_12)
updated$turnout_16 = with(updated, votes_16_total/VEP_16)
turnout_16 <- select(updated,State_ab,turnout_16)
turnout_16$Year <- 2016
historical <- merge(historical, turnout_16, by.x = c('Year','Abbreviation'), by.y = c('Year', 'State_ab'), all.x = TRUE)
historical$TurnoutHO[!is.na(historical$turnout_16)] <- historical$turnout_16[!is.na(historical$turnout_16)]
historical <- historical %>% select(-turnout_16)

#What are the historical trends?
pres <- historical %>% filter(Year%%4 == 0)
non_pres <- historical %>% filter(Year%%4 != 0)
make_wide <- function(x) {
    filtered <- x %>% select(Year, State = Abbreviation, TurnoutHO)
    filtered %>% spread(State, TurnoutHO)
}
write.csv(make_wide(pres), file = 'data/pres.csv', row.names = FALSE, na = "")
write.csv(make_wide(non_pres), file = 'data/nonpres.csv', row.names = FALSE, na = "")

#How have candidates won with total percentages?
past <- read.csv('data/popular_past.csv')
append <- updated %>% filter(State_ab=='USA') %>% select(VEP = VEP_16, vote_d = votes_d, vote_r = votes_r, vote_other = votes_other, total_vote = votes_16_total)
append <- append/1000
append$Year <- 2016
append$name_d = 'Clinton'
append$name_r = 'Trump'
append$name_other = 'Other'
past <- select(past, Year, name_d, name_r, name_other, vote_d, vote_r, vote_other, total_vote)
# past_long <- reshape(past, varying = c('name_d','name_r','name_other','vote_d','pct_d','vote_r','pct_r','vote_other','pct_other'), timevar = 'party', idvar = 'Year', sep="_", direction = 'long')
# rownames(past_long) <- c()
# past_long <- merge(past_long, historical %>% filter(Abbreviation == 'USA') %>% select(Year, VEP), by="Year", all.x = TRUE)
# past_long$VEP <- past_long$VEP/1000
# past_long$nonvote_pct <- with(past_long, (VEP - total_vote) / VEP)
# past_long$nonvote_pct <- with(past_long, (VEP - total_vote) / VEP)
past <- merge(past, historical %>% filter(Abbreviation == 'USA') %>% select(Year, VEP), by="Year", all.x = TRUE)
past$VEP = past$VEP/1000
past <- rbind(past, append)

past$pct_tot_d <- with(past, vote_d/VEP)
past$pct_tot_r <- with(past, vote_r/VEP)
past$pct_tot_other <- with(past, vote_other/VEP)
past$pct_tot_nonvote <- with(past, (VEP - total_vote) /VEP)
write.csv(past, file = 'data/pct_total.csv', row.names = FALSE, na = "")

# What turnout changes happened 12 - 16 and which party won each?
change <- pres %>% filter(Year == 2012 | Year == 2016, Abbreviation!='USA') %>% select(Year, Abbreviation, State, Turnout = TurnoutHO)
change <- change %>% spread(Year, Turnout, sep="_")
change$turnout_change <- with(change, Year_2016 - Year_2012)
change <- merge(change, updated %>% select(State_ab, d_margin_12, d_margin_16, margin_shift = margin_shit), by.x = 'Abbreviation', by.y = 'State_ab', all.x = T)
change$d_margin_12 <- change$d_margin_12 * -1
change$d_margin_16 <- change$d_margin_16 * -1
electoral_votes <- read.csv('data/electoral_votes.csv')
change <- merge(change, electoral_votes %>% select(Abbreviation, ev = Number.of.Electoral.Votes), by = 'Abbreviation', all.x = T)
write.csv(change, file = 'data/arrows/change.csv', row.names = F)

# Did previously D states generally decrease more?
d <- change %>% select(Abbreviation, turnout_change, d_margin_12, ev)
d$d_2012 <- d$d_margin_12 < 0
d$turnout_down <- d$turnout_change < 0
d %>% group_by(d_2012, turnout_down) %>% summarize(n = n(), ev = sum(ev))

# Different iterations
write.csv(change %>% filter(turnout_change>0), file = 'data/arrows/increased_turnout.csv', row.names = F)
write.csv(change %>% filter(turnout_change<0), file = 'data/arrows/decreased_turnout.csv', row.names = F)
write.csv(change %>% filter(d_margin_16 > 0 & d_margin_12 < 0), file = 'data/arrows/flipped.csv', row.names = F)
write.csv(change %>% filter(margin_shift>0), file = 'data/arrows/increased_d.csv', row.names = F)
write.csv(change %>% filter(margin_shift<0), file = 'data/arrows/increased_r.csv', row.names = F)
write.csv(change %>% filter((margin_shift<0 & turnout_change<0) | (margin_shift>0 & turnout_change>0)), file = 'data/arrows/aligning.csv', row.names = F)
write.csv(change %>% filter((margin_shift>0 & turnout_change<0) | (margin_shift<0 & turnout_change>0)), file = 'data/arrows/nonaligning.csv', row.names = F)
write.csv(change %>% filter(Abbreviation %in% c('NC','NM','NE','KS','TX','WI','IN','OH','MS','AL','SC','TN','VA','NH','RI')), file = 'data/arrows/restrictions.csv', row.names = F)

# Modeling
model_data <- change %>% select(State, Year_2012, Year_2016, d.margin_2012 = d_margin_12, d.margin_2016 = d_margin_16)
model_data <- reshape(model_data, idvar = 'State', sep = "_", direction = 'long', timevar = 'Year', varying = c('Year_2012','Year_2016','d.margin_2012','d.margin_2016'))
model <- lm(d.margin ~ Year, data = model_data)
summary(model)
model_data_narrowed <- change %>% filter(!(Abbreviation %in% c('CA','NY','HI','DC'))) %>% select(State, Year_2012, Year_2016, d.margin_2012 = d_margin_12, d.margin_2016 = d_margin_16)
model_data_narrowed <- reshape(model_data_narrowed, idvar = 'State', sep = "_", direction = 'long', timevar = 'Year', varying = c('Year_2012','Year_2016','d.margin_2012','d.margin_2016'))
model_narrowed <- lm(d.margin ~ Year, data = model_data_narrowed)
summary(model_narrowed)
